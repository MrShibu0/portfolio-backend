const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Certification = require('../models/Certification');
const Achievement = require('../models/Achievement');
const ActivityLog = require('../models/ActivityLog');

const logAction = async (username, action, details) => {
  try {
    await ActivityLog.create({ username, action, details });
  } catch (err) {
    console.error('Failed logging list action:', err.message);
  }
};

// --- SKILLS ---
const getSkills = async (req, res, next) => {
  try {
    const list = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addSkill = async (req, res, next) => {
  try {
    const item = await Skill.create(req.body);
    await logAction(req.user.username, 'ADD_SKILL', `Added skill: ${item.name}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const item = await Skill.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_SKILL', `Deleted skill: ${item.name}`);
    }
    res.json({ message: 'Skill deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- EDUCATION ---
const getEducation = async (req, res, next) => {
  try {
    const list = await Education.find().sort({ displayOrder: 1, year: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addEducation = async (req, res, next) => {
  try {
    const item = await Education.create(req.body);
    await logAction(req.user.username, 'ADD_EDUCATION', `Added education: ${item.degree}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const item = await Education.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_EDUCATION', `Deleted education record for: ${item.degree}`);
    }
    res.json({ message: 'Education record deleted.' });
  } catch (error) {
    next(error);
  }
};

// --- EXPERIENCE ---
const getExperience = async (req, res, next) => {
  try {
    const list = await Experience.find().sort({ displayOrder: 1, startDate: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addExperience = async (req, res, next) => {
  try {
    const item = await Experience.create(req.body);
    await logAction(req.user.username, 'ADD_EXPERIENCE', `Added job experience: ${item.position} at ${item.company}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_EXPERIENCE', `Deleted job experience: ${item.position} at ${item.company}`);
    }
    res.json({ message: 'Experience record deleted.' });
  } catch (error) {
    next(error);
  }
};

// --- CERTIFICATIONS ---
const getCertifications = async (req, res, next) => {
  try {
    const list = await Certification.find().sort({ displayOrder: 1, date: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addCertification = async (req, res, next) => {
  try {
    const item = await Certification.create(req.body);
    await logAction(req.user.username, 'ADD_CERTIFICATION', `Added certification: ${item.name}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateCertification = async (req, res, next) => {
  try {
    const item = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteCertification = async (req, res, next) => {
  try {
    const item = await Certification.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_CERTIFICATION', `Deleted certification: ${item.name}`);
    }
    res.json({ message: 'Certification deleted.' });
  } catch (error) {
    next(error);
  }
};

// --- ACHIEVEMENTS ---
const getAchievements = async (req, res, next) => {
  try {
    const list = await Achievement.find().sort({ displayOrder: 1, date: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.create(req.body);
    await logAction(req.user.username, 'ADD_ACHIEVEMENT', `Added achievement: ${item.title}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const item = await Achievement.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_ACHIEVEMENT', `Deleted achievement: ${item.title}`);
    }
    res.json({ message: 'Achievement deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills, addSkill, updateSkill, deleteSkill,
  getEducation, addEducation, updateEducation, deleteEducation,
  getExperience, addExperience, updateExperience, deleteExperience,
  getCertifications, addCertification, updateCertification, deleteCertification,
  getAchievements, addAchievement, updateAchievement, deleteAchievement
};
