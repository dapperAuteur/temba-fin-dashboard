import { Schema, model, models } from "mongoose";
import { IVendor } from "@/types/vendors";

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true },
  websites: [{ type: String, required: false }],
  contacts: [{ type: String, required: false }],
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});

export default models.Vendor || model<IVendor>("Vendor", VendorSchema);