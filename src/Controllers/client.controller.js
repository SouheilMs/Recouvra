const Client = require('../models/Client');

// Create Client
const createClient = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Vérifier si l'email existe déjà
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(409).json({
        success: false,
        message: 'Client with this email already exists.',
      });
    }

    const client = await Client.create({ name, email, phone, address });

    res.status(201).json({
      success: true,
      message: 'Client created successfully.',
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Get All Clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Get Client By ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Update Client
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client updated successfully.',
      data: client,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

// Delete Client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: err.message,
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};