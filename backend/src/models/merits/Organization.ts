import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IOrganization extends IPublication {
  organizationType: "congresos internacionales" | "congresos nacionales" | "seminarios internacionales" | "otros" | "n/a";
}

const organizationSchema = new Schema<IOrganization>({
  organizationType: {
    type: String,
    required: true,
    enum: [
      "congresos internacionales",
      "congresos nacionales",
      "seminarios internacionales",
      "otros",
      "n/a"
    ],
    default: "n/a",
  },
});

export const Organization = Publication.discriminator<IOrganization>('Organization', organizationSchema);
