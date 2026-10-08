import User from '../models/User.js';

export const getProfile = async (req, res, next) => { try { res.json({ user: req.user }); } catch(e){ next(e); } };
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (password) user.password = password;
    await user.save();
    const safe = user.toObject(); delete safe.password;
    res.json({ user: safe });
  } catch(e){ next(e); }
};
export const listUsers = async (req,res,next) => { try { const users=await User.find().select('-password').sort('-createdAt'); res.json(users); } catch(e){next(e);} };
