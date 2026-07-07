const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMajorProjects, addMajorProject, updateMajorProject, deleteMajorProject, duplicateMajorProject, reorderMajorProjects,
  getMinorProjects, addMinorProject, updateMinorProject, deleteMinorProject, duplicateMinorProject, reorderMinorProjects
} = require('../controllers/projectController');

// Major Projects
router.route('/major')
  .get(getMajorProjects)
  .post(protect, addMajorProject);

router.route('/major/reorder')
  .put(protect, reorderMajorProjects);

router.route('/major/:id')
  .put(protect, updateMajorProject)
  .delete(protect, deleteMajorProject);

router.route('/major/:id/duplicate')
  .post(protect, duplicateMajorProject);

// Minor Projects
router.route('/minor')
  .get(getMinorProjects)
  .post(protect, addMinorProject);

router.route('/minor/reorder')
  .put(protect, reorderMinorProjects);

router.route('/minor/:id')
  .put(protect, updateMinorProject)
  .delete(protect, deleteMinorProject);

router.route('/minor/:id/duplicate')
  .post(protect, duplicateMinorProject);

module.exports = router;
