"""Tests for the Python superposition engine. Stdlib only (unittest).

Run:  python -m unittest python/test_superposition.py   (from the repo root)
  or: python python/test_superposition.py

Covers: no drift from the grid, always-on behaviour, routing, determinism, id
uniqueness, and CROSS-LANGUAGE PARITY against the JS engine (skipped if node is
absent). The map text is identical across languages because both read the same grid;
the parity test proves the two selectors also pick the same map.
"""

import json
import os
import subprocess
import shutil
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, "..")
sys.path.insert(0, HERE)

import superposition as sp        # the generated single-file engine
import build_grid                 # the generator (for the drift check)

KET_R = "⟩"


def load_cases():
    with open(os.path.join(REPO, "fixtures", "cases.json"), "r", encoding="utf-8") as f:
        return json.load(f)


# A corpus of three-POV triples exercising matched + default + edge paths.
CORPUS = [
    {"task": "I need to debug this code and fix the failing test", "description": "", "wants": ""},
    {"task": "research and analysis of the sources for this question", "description": "the field they sit in", "wants": "a verdict"},
    {"task": "reduce support ticket volume the board sees", "description": "a billing bug drives the tickets", "wants": "a number down for a real reason"},
    {"task": "write a launch blog post", "description": "announce the tool", "wants": "readers actually try it"},
    {"task": "plan the Q3 roadmap", "description": "list features to ship", "wants": "a plan that survives first contact"},
    {"task": "review this pull request", "description": "check the diff before approving", "wants": "know if it is safe to merge"},
    {"task": "transform this data into the requested format", "description": "keep the semantics", "wants": "the consumer accepts it"},
    {"task": "the capital of france", "description": "", "wants": ""},
    {"task": "xyzzy plugh frobnicate", "description": "quux blorp", "wants": "wibble"},
    {"task": "", "description": "", "wants": ""},
    {"task": "x", "description": "y", "wants": "z"},
    {"task": "deploy the service and update the changelog", "description": "ship it", "wants": "no downtime"},
]


class TestSuperposition(unittest.TestCase):
    def test_no_drift_from_grid(self):
        with open(os.path.join(HERE, "superposition.py"), "r", encoding="utf-8") as f:
            committed = f.read()
        self.assertEqual(
            build_grid.render(),
            committed,
            "superposition.py is stale. Run `python python/build_grid.py`.",
        )

    def test_always_on_returns_a_map_with_kets(self):
        for c in CORPUS:
            r = sp.superposition(c["task"], c["description"], c["wants"])
            self.assertIsNotNone(r["map"], "map was None for %r" % c)
            self.assertTrue(r["map"], "empty map for %r" % c)
            self.assertIn("| ", r["map"])
            self.assertIn(KET_R, r["map"])
            self.assertIn("—?—", r["map"])  # the —?— connective

    def test_routing_fixtures(self):
        for c in load_cases():
            r = sp.superposition(c["text"], "", "")
            if c.get("expect_task_type"):
                self.assertTrue(r["matched"], "expected match for %r" % c["text"])
                self.assertEqual(r["task_type"], c["expect_task_type"], c["text"])
            elif c.get("expect_matched") is False:
                self.assertFalse(r["matched"], "expected no match for %r" % c["text"])
                self.assertTrue(r["map"])

    def test_deterministic(self):
        for c in CORPUS:
            a = sp.superposition(c["task"], c["description"], c["wants"])
            b = sp.superposition(c["task"], c["description"], c["wants"])
            self.assertEqual(a, b)

    def test_ids_unique(self):
        seen = set()
        for row in sp.ROWS:
            i = sp._id_of(row)
            self.assertNotIn(i, seen, "duplicate id %s" % i)
            seen.add(i)

    def test_default_ids_exist(self):
        ids = {sp._id_of(r) for r in sp.ROWS}
        for d in sp.DEFAULT_IDS:
            self.assertIn(d, ids, "default id missing: %s" % d)

    @unittest.skipIf(shutil.which("node") is None, "node not available")
    def test_cross_language_parity_with_js(self):
        # Run the same corpus through the JS engine (dist/backend.cjs) and assert the
        # Python engine picks the identical map for every input.
        backend = os.path.join(REPO, "dist", "backend.cjs").replace("\\", "/")
        script = (
            "const {superposition}=require(%r);"
            "const inp=JSON.parse(require('fs').readFileSync(0,'utf8'));"
            "process.stdout.write(JSON.stringify(inp.map(t=>"
            "superposition(t.task||'',t.description||'',t.wants||'').map)));"
        ) % backend
        proc = subprocess.run(
            ["node", "-e", script],
            input=json.dumps(CORPUS).encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr.decode("utf-8", "replace"))
        js_maps = json.loads(proc.stdout.decode("utf-8"))
        py_maps = [sp.superposition(c["task"], c["description"], c["wants"])["map"] for c in CORPUS]
        for i, (j, p) in enumerate(zip(js_maps, py_maps)):
            self.assertEqual(j, p, "parity mismatch at corpus[%d]: %r" % (i, CORPUS[i]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
