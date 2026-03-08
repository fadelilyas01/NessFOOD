from django.test import TestCase

class CoreTests(TestCase):
    def test_basic_math(self):
        """A simple test to ensure pytest collects and passes at least one test."""
        self.assertEqual(1 + 1, 2)
