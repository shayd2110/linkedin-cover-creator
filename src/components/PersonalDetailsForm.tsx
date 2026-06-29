import { useShallow } from "zustand/react/shallow";
import { useCoverStore } from "../store/useCoverStore";

export const PersonalDetailsForm: React.FC = () => {
  const { firstName, lastName, jobTitle, email, phone, updateField } = useCoverStore(
    useShallow((state) => ({
      firstName: state.firstName,
      lastName: state.lastName,
      jobTitle: state.jobTitle,
      email: state.email,
      phone: state.phone,
      updateField: state.updateField,
    }))
  );
  return (
    <div className="tab-pane">
      <h3>Personal Details</h3>

      <div className="input-group-row">
        <div className="input-field">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="e.g. Shay" />
        </div>
        <div className="input-field">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="e.g. Doron" />
        </div>
      </div>

      <div className="input-field">
        <label htmlFor="jobTitle">Job Title</label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => updateField("jobTitle", e.target.value)}
          placeholder="e.g. Frontend/Full Stack Developer"
        />
      </div>

      <div className="input-field">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" value={email} onChange={(e) => updateField("email", e.target.value)} placeholder="e.g. name@example.com" />
      </div>

      <div className="input-field">
        <label htmlFor="phone">Phone Number</label>
        <input type="text" id="phone" value={phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="e.g. 054-6676278" />
      </div>
    </div>
  );
};
