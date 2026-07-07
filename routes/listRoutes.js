const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSkills, addSkill, updateSkill, deleteSkill,
  getEducation, addEducation, updateEducation, deleteEducation,
  getExperience, addExperience, updateExperience, deleteExperience,
  getCertifications, addCertification, updateCertification, deleteCertification,
  getAchievements, addAchievement, updateAchievement, deleteAchievement
} = require('../controllers/listController');

// Skills routes
router.route('/skills').get(getSkills).post(protect, addSkill);
router.route('/skills/:id').put(protect, updateSkill).delete(protect, deleteSkill);

// Education routes
router.route('/education').get(getEducation).post(protect, addEducation);
router.route('/education/:id').put(protect, updateEducation).delete(protect, deleteEducation);

// Experience routes
router.route('/experience').get(getExperience).post(protect, addExperience);
router.route('/experience/:id').put(protect, updateExperience).delete(protect, deleteExperience);

// Certifications routes
router.route('/certifications').get(getCertifications).post(protect, addCertification);
router.route('/certifications/:id').put(protect, updateCertification).delete(protect, deleteCertification);

// Achievements routes
router.route('/achievements').get(getAchievements).post(protect, addAchievement);
router.route('/achievements/:id').put(protect, updateAchievement).delete(protect, deleteAchievement);

module.exports = router;
