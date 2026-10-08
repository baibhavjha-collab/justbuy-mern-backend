export const uploadProductImage = async (req,res) => {
  if (!req.file) return res.status(400).json({ message: 'Please select an image.' });
  const base = `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ url: `${base}/uploads/${req.file.filename}` });
};
