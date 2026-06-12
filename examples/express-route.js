// Reference Express integration for self-hosting Superposition.
//
// This is the exact wrapper that runs the public endpoints at
// api.ejentum.com/superposition (REST) and /superposition-mcp (MCP-over-HTTP).
// It is keyless and contains no secrets. The engine is the generated CommonJS
// module dist/backend.cjs (regenerate with `npm run build`); copy it next to your
// server or require it from this repo.
//
// Mount it BEFORE any auth/CORS/JSON middleware so it stays keyless and isolated.
// In your server.js, two lines:
//
//     const { mountSuperposition } = require('./routes/superposition');
//     mountSuperposition(app);   // before app.use(cors()), helmet(), express.json(), etc.
//
// Contract (must match mcp/src/client.ts): the REST endpoint returns a one-element
// array [{ label, map, task_type, matched }]. The MCP tool returns the map text.
//
// Deps: express, helmet, express-rate-limit, @modelcontextprotocol/sdk, zod.

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');

const { superposition } = require('../dist/backend.cjs');

const FALLBACK =
    'GOAL\n| this step closed ⟩ —?— | the mission advanced ⟩\nwhich am I serving this turn — and what evidence says the other is still on course?';

const TOOL_DESCRIPTION =
    'Superposition. State three points of view on your task (task as given, task as you understand it, what you infer the user wants) and you get back ONE two-pole terrain map: an axis with two legitimate poles and a question that makes you locate which pole you are serving and what makes the other a real mistake here. Always returns a map, selected by a transparent heuristic over an open CSV (no LLM). Keyless and free. The map is not a verdict; answer its question to yourself, do not echo it verbatim.';

const povSchema = {
    task: z
        .string()
        .min(1, 'task must be a non-empty string')
        .describe('The task as given, in the words you were handed it.'),
    description: z
        .string()
        .min(1, 'description must be a non-empty string')
        .describe('The task as YOU currently understand it, in your own words.'),
    wants: z
        .string()
        .min(1, 'wants must be a non-empty string')
        .describe('What you infer the user actually WANTS underneath the literal task.'),
};

function scopedHelmet() {
    return helmet({
        contentSecurityPolicy: false,
        frameguard: { action: 'deny' },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        noSniff: true,
    });
}

function ipLimiter(max) {
    return rateLimit({
        windowMs: 60 * 1000,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Rate limit exceeded' },
    });
}

function readPovs(body) {
    const s = (v) => (body && typeof v === 'string' ? v : '');
    return { task: s(body.task), description: s(body.description), wants: s(body.wants) };
}

// REST: returns [{ label, map, task_type, matched }] (array shape matches client.ts).
function restHandler(req, res) {
    const { task, description, wants } = readPovs(req.body || {});
    if (!task || !description || !wants) {
        return res.status(400).json({
            error: 'Provide non-empty "task", "description", and "wants" strings.',
        });
    }
    res.json([superposition(task, description, wants)]);
}

// MCP-over-HTTP: tool superposition, returns the map text only.
function buildSuperpositionServer() {
    const server = new McpServer({ name: 'superposition', version: '0.1.0' });
    server.tool('superposition', TOOL_DESCRIPTION, povSchema, async ({ task, description, wants }) => {
        const result = superposition(task, description, wants);
        const text = result.map ? result.map : FALLBACK;
        return { content: [{ type: 'text', text }] };
    });
    return server;
}

async function mcpHandler(req, res) {
    const server = buildSuperpositionServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
        transport.close().catch(() => {});
        server.close().catch(() => {});
    });
    try {
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: { code: -32603, message: 'Internal error' },
                id: req.body && req.body.id !== undefined ? req.body.id : null,
            });
        }
    }
}

// Middleware is bound inline per exact route so the REST limiter does not
// prefix-match the MCP path.
function mountSuperposition(app) {
    const helmetMw = scopedHelmet();
    const restJson = express.json({ limit: '16kb' });
    const mcpJson = express.json({ limit: '1mb' });

    app.post('/superposition', helmetMw, ipLimiter(120), restJson, restHandler);

    app.post('/superposition-mcp', helmetMw, ipLimiter(60), mcpJson, mcpHandler);
    app.get('/superposition-mcp', helmetMw, ipLimiter(60), mcpHandler);
    app.delete('/superposition-mcp', helmetMw, ipLimiter(60), mcpHandler);
}

module.exports = { mountSuperposition };
