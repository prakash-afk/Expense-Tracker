import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    
description : {
    type : String,
    required : true
  },
  amount : {
    type : Number,
    required : true
  },
  category: {
    type: String,
    required : true,
  },
  date: {
    type: Date,
    required : true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
    index: true,
  },
  type: {
    type: String,
    default: "expense",  
  },

},{
    timestamps:true,
    collection: "expenses",
})

expenseSchema.index({ userId: 1, date: -1 });

const expenseModel=mongoose.models.Expense || mongoose.model("Expense",expenseSchema);
export default expenseModel;
