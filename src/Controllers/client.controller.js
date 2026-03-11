const Client = require('../models/Client');
const { createClientSchema, updateClientSchema } = require('../validations/client.validation');

/**
 * Create a new client
 */
const createClient = async (req, res) => {
  try {
    const { error, value } = createClientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingClient = await Client.findOne({ email: value.email });
    if (existingClient) {
      return res.status(409).json({ success: false, message: 'Client with this email already exists.' });
    }

    const client = await Client.create(value);
    res.status(201).json({ success: true, message: 'Client created successfully.', data: client });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get all clients
 */
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Get a client by ID
 */
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Update a client
 */
const updateClient = async (req, res) => {
  try {
    const { error, value } = updateClientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const client = await Client.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }
    res.status(200).json({ success: true, message: 'Client updated successfully.', data: client });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

/**
 * Delete a client
 */
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found.' });
    }
    res.status(200).json({ success: true, message: 'Client deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
};

module.exports = { createClient, getClients, getClientById, updateClient, deleteClient };
