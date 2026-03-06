const CollectionAction = require('../models/CollectionAction');

const createAction = async (req, res) => {
  try {
    const { error, value } = createActionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const action = await CollectionAction.create({ ...value, performedBy: req.user._id });
    const populated = await action.populate([
      { path: 'client', select: 'name email' },
      { path: 'invoice', select: 'amount status' },
      { path: 'performedBy', select: 'name email' },
    ]);

    res.status(201).json({ success: true, message: 'Collection action recorded.', data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const getActions = async (req, res) => {
  try {
    const actions = await CollectionAction.find()
      .populate('client', 'name email')
      .populate('invoice', 'amount status')
      .populate('performedBy', 'name email')
      .sort({ actionDate: -1 });
    res.status(200).json({ success: true, data: actions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const getActionById = async (req, res) => {
  try {
    const action = await CollectionAction.findById(req.params.id)
      .populate('client', 'name email')
      .populate('invoice', 'amount status')
      .populate('performedBy', 'name email');
    if (!action) {
      return res.status(404).json({ success: false, message: 'Collection action not found.' });
    }
    res.status(200).json({ success: true, data: action });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const updateAction = async (req, res) => {
  try {
    const { error, value } = updateActionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const action = await CollectionAction.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true })
      .populate('client', 'name email')
      .populate('invoice', 'amount status')
      .populate('performedBy', 'name email');
    if (!action) {
      return res.status(404).json({ success: false, message: 'Collection action not found.' });
    }
    res.status(200).json({ success: true, message: 'Collection action updated.', data: action });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

const deleteAction = async (req, res) => {
  try {
    const action = await CollectionAction.findByIdAndDelete(req.params.id);
    if (!action) {
      return res.status(404).json({ success: false, message: 'Collection action not found.' });
    }
    res.status(200).json({ success: true, message: 'Collection action deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { createAction, getActions, getActionById, updateAction, deleteAction };
