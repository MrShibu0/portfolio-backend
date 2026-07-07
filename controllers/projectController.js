const MajorProject = require('../models/MajorProject');
const MinorProject = require('../models/MinorProject');
const ActivityLog = require('../models/ActivityLog');

const logAction = async (username, action, details) => {
  try {
    await ActivityLog.create({ username, action, details });
  } catch (err) {
    console.error('Failed logging project action:', err.message);
  }
};

// --- MAJOR PROJECTS ---
const getMajorProjects = async (req, res, next) => {
  try {
    const list = await MajorProject.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addMajorProject = async (req, res, next) => {
  try {
    const item = await MajorProject.create(req.body);
    await logAction(req.user.username, 'ADD_MAJOR_PROJECT', `Added major project: ${item.title}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateMajorProject = async (req, res, next) => {
  try {
    const item = await MajorProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteMajorProject = async (req, res, next) => {
  try {
    const item = await MajorProject.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_MAJOR_PROJECT', `Deleted major project: ${item.title}`);
    }
    res.json({ message: 'Major project deleted.' });
  } catch (error) {
    next(error);
  }
};

const duplicateMajorProject = async (req, res, next) => {
  try {
    const project = await MajorProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const dupData = project.toObject();
    delete dupData._id;
    delete dupData.createdAt;
    delete dupData.updatedAt;

    dupData.title = `${dupData.title} (Copy)`;
    if (dupData.slug) {
      dupData.slug = `${dupData.slug}-copy`;
    }
    dupData.featured = false;

    // Place it at the end of the order
    const count = await MajorProject.countDocuments();
    dupData.displayOrder = count;

    const duplicate = await MajorProject.create(dupData);
    await logAction(req.user.username, 'DUPLICATE_MAJOR_PROJECT', `Duplicated major project: ${project.title} as ${duplicate.title}`);
    res.status(201).json(duplicate);
  } catch (error) {
    next(error);
  }
};

const reorderMajorProjects = async (req, res, next) => {
  try {
    const { orders } = req.body; // Array of { id, displayOrder }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders array is required.' });
    }

    const promises = orders.map(item =>
      MajorProject.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(promises);
    res.json({ message: 'Major projects reordered successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- MINOR PROJECTS ---
const getMinorProjects = async (req, res, next) => {
  try {
    const list = await MinorProject.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addMinorProject = async (req, res, next) => {
  try {
    const item = await MinorProject.create(req.body);
    await logAction(req.user.username, 'ADD_MINOR_PROJECT', `Added minor project: ${item.title}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateMinorProject = async (req, res, next) => {
  try {
    const item = await MinorProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteMinorProject = async (req, res, next) => {
  try {
    const item = await MinorProject.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_MINOR_PROJECT', `Deleted minor project: ${item.title}`);
    }
    res.json({ message: 'Minor project deleted.' });
  } catch (error) {
    next(error);
  }
};

const duplicateMinorProject = async (req, res, next) => {
  try {
    const project = await MinorProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const dupData = project.toObject();
    delete dupData._id;
    delete dupData.createdAt;
    delete dupData.updatedAt;

    dupData.title = `${dupData.title} (Copy)`;
    dupData.featured = false;

    const count = await MinorProject.countDocuments();
    dupData.displayOrder = count;

    const duplicate = await MinorProject.create(dupData);
    await logAction(req.user.username, 'DUPLICATE_MINOR_PROJECT', `Duplicated minor project: ${project.title} as ${duplicate.title}`);
    res.status(201).json(duplicate);
  } catch (error) {
    next(error);
  }
};

const reorderMinorProjects = async (req, res, next) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Orders array is required.' });
    }

    const promises = orders.map(item =>
      MinorProject.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder })
    );
    await Promise.all(promises);
    res.json({ message: 'Minor projects reordered successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMajorProjects, addMajorProject, updateMajorProject, deleteMajorProject, duplicateMajorProject, reorderMajorProjects,
  getMinorProjects, addMinorProject, updateMinorProject, deleteMinorProject, duplicateMinorProject, reorderMinorProjects
};
