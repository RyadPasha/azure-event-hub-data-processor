/**
 * Mongoose schema for the Message document.
 * Represents a processed event stored in the MongoDB collection.
 *
 * @author    Mohamed Riyad <m@ryad.me>
 * @link      https://ryadpasha.com
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'processed_events' }) // If not specified, Mongoose will use the pluralized model name as the collection name, i.g, `messages`
export class Message extends Document {
  /**
   * The content of the message, stored as a generic object.
   */
  @Prop({ type: Object })
  content: Record<string, any>;

  /**
   * The timestamp when the message was created, defaulting to the current date and time.
   */
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
