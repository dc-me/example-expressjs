import { Schema, model } from 'mongoose';

export const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: 'Product',
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: (props) => `No product specified in order.`,
      },
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'processing',
          'shipped',
          'delivered',
          'canceled',
          'returned',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Order', orderSchema);
