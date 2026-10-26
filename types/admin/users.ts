type Role = "user" | "artisan";
type Status = "Verified" | "Not verified"
type emailVerified = "Verified" | "Not verified"
type phoneVerified = "Verified" | "Not verified"
type idDocVerified = "Pending" | "Verified" | "Not verified"
type nin = "Provided" | "Not provided"
type bvn = "Provided" | "Not provided"
type uploadedDoc = "Provided" | "Not provided"

interface Users {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  status: Status;
  address: string;
  state: string;
  country: string;
  emailVerified: emailVerified;
  phoneVerified: phoneVerified;
  idDocVerified?: idDocVerified;
  nin?: nin;
  bvn?: bvn;
  uploadedDocType?: uploadedDoc;
  uploadedDoc?: uploadedDoc;
  joinedAt: string;
}
