import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
    validate: {
      validator: function(name) {
        return /^[a-zA-Z\s\-'.]+$/.test(name);
      },
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email address'
    },
    index: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters long'],
    maxlength: [100, 'Subject cannot exceed 100 characters'],
    validate: {
      validator: function(subject) {
        const forbiddenPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
        ];
        return !forbiddenPatterns.some(pattern => pattern.test(subject));
      },
      message: 'Subject contains invalid content'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
    validate: {
      validator: function(message) {
        const forbiddenPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
        ];
        return !forbiddenPatterns.some(pattern => pattern.test(message));
      },
      message: 'Message contains invalid content'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'read', 'replied', 'archived'],
      message: 'Status must be either new, read, replied, or archived'
    },
    default: 'new',
    index: true
  },
  ipAddress: {
    type: String,
    trim: true,
    maxlength: [45, 'IP address too long'],
    validate: {
      validator: function(ip) {
        if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
          return true;
        }
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(ip) || ipv6Regex.test(ip);
      },
      message: 'Please provide a valid IPv4 or IPv6 address'
    }
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent too long']
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'normal', 'high', 'urgent'],
      message: 'Priority must be either low, normal, high, or urgent'
    },
    default: 'normal'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  response: {
    repliedAt: {
      type: Date
    },
    repliedBy: {
      type: String,
      trim: true,
      maxlength: [50, 'Replied by name too long']
    },
    responseMessage: {
      type: String,
      trim: true,
      maxlength: [2000, 'Response message cannot exceed 2000 characters']
    }
  },
  source: {
    type: String,
    enum: {
      values: ['website', 'mobile', 'api', 'admin'],
      message: 'Source must be either website, mobile, api, or admin'
    },
    default: 'website'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

// Virtuals
contactSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

contactSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

contactSchema.virtual('isNewMessage').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours < 24;
});

// Indexes
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });
contactSchema.index({ tags: 1 });
contactSchema.index({ 
  name: 'text', 
  email: 'text', 
  subject: 'text', 
  message: 'text' 
});

// Pre-save middleware
contactSchema.pre('save', function(next) {
  if (this.name) this.name = this.name.trim();
  if (this.email) this.email = this.email.trim().toLowerCase();
  if (this.subject) this.subject = this.subject.trim();
  if (this.message) this.message = this.message.trim();
  
  this.tags = this.extractTags();
  this.priority = this.determinePriority();
  
  next();
});

contactSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'replied' && !this.response.repliedAt) {
    this.response.repliedAt = new Date();
  }
  next();
});

// Instance methods
contactSchema.methods.extractTags = function() {
  const tags = new Set();
  const content = `${this.subject} ${this.message}`.toLowerCase();
  
  const commonTags = {
    'website': ['website', 'web', 'site', 'portfolio'],
    'mobile': ['mobile', 'app', 'android', 'ios', 'react native'],
    'frontend': ['frontend', 'react', 'vue', 'angular', 'javascript', 'css', 'html'],
    'backend': ['backend', 'node', 'express', 'python', 'django', 'php', 'laravel'],
    'database': ['database', 'mongodb', 'mysql', 'postgresql', 'firebase'],
    'ecommerce': ['ecommerce', 'shop', 'store', 'payment', 'cart'],
    'api': ['api', 'rest', 'graphql', 'endpoint'],
    'urgent': ['urgent', 'asap', 'immediately', 'emergency'],
    'collaboration': ['collaborate', 'partner', 'team up', 'work together'],
    'freelance': ['freelance', 'contract', 'project', 'hire'],
    'job': ['job', 'career', 'position', 'employment', 'hire me']
  };
  
  Object.keys(commonTags).forEach(tag => {
    commonTags[tag].forEach(keyword => {
      if (content.includes(keyword)) {
        tags.add(tag);
      }
    });
  });
  
  return Array.from(tags);
};

contactSchema.methods.determinePriority = function() {
  const content = `${this.subject} ${this.message}`.toLowerCase();
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'immediately', 'critical'];
  const highPriorityKeywords = ['important', 'deadline', 'hiring', 'job offer', 'collaboration'];
  
  if (urgentKeywords.some(keyword => content.includes(keyword))) {
    return 'urgent';
  }
  
  if (highPriorityKeywords.some(keyword => content.includes(keyword))) {
    return 'high';
  }
  
  return 'normal';
};

contactSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

contactSchema.methods.markAsReplied = function(repliedBy = 'Admin', responseMessage = '') {
  this.status = 'replied';
  this.response = {
    repliedAt: new Date(),
    repliedBy: repliedBy,
    responseMessage: responseMessage
  };
  return this.save();
};

contactSchema.methods.getSummary = function() {
  const messagePreview = this.message.length > 100 
    ? this.message.substring(0, 100) + '...' 
    : this.message;
  
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    subject: this.subject,
    messagePreview: messagePreview,
    status: this.status,
    priority: this.priority,
    createdAt: this.createdAt,
    isNew: this.isNewMessage
  };
};

// Static methods
contactSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

contactSchema.statics.findUrgent = function() {
  return this.find({ 
    $or: [
      { priority: 'urgent' },
      { priority: 'high', status: 'new' }
    ]
  }).sort({ createdAt: -1 });
};

contactSchema.statics.search = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { subject: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ createdAt: -1 });
};

contactSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $facet: {
        statusCounts: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        priorityCounts: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        dailyStats: [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: -1 } },
          { $limit: 30 }
        ],
        tagStats: [
          { $unwind: '$tags' },
          { $group: { _id: '$tags', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);

  return stats[0] || {
    statusCounts: [],
    priorityCounts: [],
    dailyStats: [],
    tagStats: []
  };
};

contactSchema.statics.cleanupOldMessages = async function() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const result = await this.deleteMany({
    status: 'archived',
    createdAt: { $lt: oneYearAgo }
  });
  
  return result;
};

// Query helpers
contactSchema.query.active = function() {
  return this.where({ status: { $ne: 'archived' } });
};

contactSchema.query.newMessages = function() {
  return this.where({ status: 'new' });
};

contactSchema.query.requiresResponse = function() {
  return this.where({ status: { $in: ['new', 'read'] } });
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;