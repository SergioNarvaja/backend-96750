import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      index: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: Boolean,
      default: true,
      index: true
    },
    thumbnails: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;