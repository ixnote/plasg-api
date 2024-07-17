import mongoose from "mongoose";

export interface CreateNews{
    reference?: string,
    headline: string,
    image?: string,
    tags: string[],
    mda?: string
}