import { Schema } from "mongoose";
import { Member } from "../interfaces/member.interface";

export const MemberSchema = new Schema<Member>(
    {
      name: {
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
      title: {
        type: String,
        required: false,
      },
      role: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 
      },
      type: {
        type: String,
        required: false,
      },
      constituency: {
        type: String,
        required: false,
      },
      party: {
        type: String,
        required: false,
      },
    },
  );