import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid email or password.' });
    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (e) { next(e); }
};

export const me = async (req, res) => res.json({ user: publicUser(req.user) });

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role !== 'admin' || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid administrator credentials.' });
    res.json({ token: generateToken(user._id), user: publicUser(user) });
  } catch (e) { next(e); }
};
