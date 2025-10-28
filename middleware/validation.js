import validator from 'validator';

export const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  // Check required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate name length
  if (!validator.isLength(name, { min: 2, max: 50 })) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters'
    });
  }

  // Validate subject length
  if (!validator.isLength(subject, { min: 5, max: 100 })) {
    return res.status(400).json({
      success: false,
      message: 'Subject must be between 5 and 100 characters'
    });
  }

  // Validate message length
  if (!validator.isLength(message, { min: 10, max: 1000 })) {
    return res.status(400).json({
      success: false,
      message: 'Message must be between 10 and 1000 characters'
    });
  }

  // Sanitize inputs
  req.body.name = validator.escape(name);
  req.body.subject = validator.escape(subject);
  req.body.message = validator.escape(message);

  next();
};