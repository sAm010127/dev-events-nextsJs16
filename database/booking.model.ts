import {
  Schema,
  model,
  models,
  type HydratedDocument,
  type Model,
  type Types,
} from 'mongoose';
import { Event } from '@/database/event.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type BookingDocument = HydratedDocument<IBooking>;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: 'Please provide a valid email address.',
      },
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre('save', async function (this: BookingDocument) {
  // Keep email normalized for consistent lookups and uniqueness checks.
  this.email = this.email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error('Please provide a valid email address.');
  }

  // Ensure bookings cannot be created for events that do not exist.
  if (this.isModified('eventId') || this.isNew) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error('Referenced event does not exist.');
    }
  }
});

export const Booking: Model<IBooking> =
  (models.Booking as Model<IBooking>) ||
  model<IBooking>('Booking', bookingSchema);

export default Booking;
