import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
} from 'mongoose';

type EventStringField =
  | 'title'
  | 'description'
  | 'overview'
  | 'image'
  | 'venue'
  | 'location'
  | 'date'
  | 'time'
  | 'mode'
  | 'audience'
  | 'organizer';

const REQUIRED_STRING_FIELDS: EventStringField[] = [
  'title',
  'description',
  'overview',
  'image',
  'venue',
  'location',
  'date',
  'time',
  'mode',
  'audience',
  'organizer',
];

export interface IEvent {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (entries: string[]) =>
          entries.length > 0 && entries.every((entry) => entry.trim().length > 0),
        message: 'Agenda must contain at least one non-empty item.',
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (entries: string[]) =>
          entries.length > 0 && entries.every((entry) => entry.trim().length > 0),
        message: 'Tags must contain at least one non-empty item.',
      },
    },
  },
  {
    timestamps: true,
  },
);

function ensureNonEmptyString(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required and cannot be empty.`);
  }
  return normalized;
}

function normalizeStringArray(values: string[], fieldName: string): string[] {
  if (values.length === 0) {
    throw new Error(`${fieldName} must contain at least one item.`);
  }

  return values.map((value, index) => {
    const normalized = value.trim();
    if (!normalized) {
      throw new Error(`${fieldName}[${index}] cannot be empty.`);
    }
    return normalized;
  });
}

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeDate(dateValue: string): string {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('date must be a valid date value.');
  }
  return parsed.toISOString();
}

function normalizeTime(timeValue: string): string {
  const normalized = timeValue.trim().toLowerCase();
  const twelveHourMatch = normalized.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const meridiem = twelveHourMatch[3].toLowerCase();

    if (hours < 1 || hours > 12 || minutes > 59) {
      throw new Error('time must be a valid clock time.');
    }

    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const twentyFourHourMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hours = Number(twentyFourHourMatch[1]);
    const minutes = Number(twentyFourHourMatch[2]);

    if (hours > 23 || minutes > 59) {
      throw new Error('time must be a valid clock time.');
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  throw new Error('time must be in HH:mm or h:mm AM/PM format.');
}

eventSchema.pre('save', function (this: EventDocument, next) {
  try {
    for (const field of REQUIRED_STRING_FIELDS) {
      this[field] = ensureNonEmptyString(this[field], field);
    }

    this.agenda = normalizeStringArray(this.agenda, 'agenda');
    this.tags = normalizeStringArray(this.tags, 'tags');

    // Only update slug when title changes so links remain stable otherwise.
    if (this.isModified('title')) {
      this.slug = toSlug(this.title);
      if (!this.slug) {
        throw new Error('Unable to generate slug from title.');
      }
    }

    // Normalize date/time before persistence to keep a consistent format.
    if (this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

eventSchema.index({ slug: 1 }, { unique: true });

export const Event: Model<IEvent> =
  (models.Event as Model<IEvent>) || model<IEvent>('Event', eventSchema);

export default Event;
