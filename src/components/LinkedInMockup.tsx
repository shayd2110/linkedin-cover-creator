import React from "react";
import { useCoverStore } from "../store/useCoverStore";
import { ActionButtons } from "./ActionButtons";

export const LinkedInMockup: React.FC = () => {
    const { firstName, lastName, jobTitle } = useCoverStore();

    return (
        <div className="linkedin-mockup-details">
            <div className="mockup-profile-name">
                {firstName} {lastName}
            </div>
            <div className="mockup-profile-headline">{jobTitle}</div>
            <div className="mockup-profile-location">
                North District, Israel • <span className="mockup-link">Contact info</span>
            </div>
            <div className="mockup-profile-connections">500+ connections</div>
            <ActionButtons />
        </div>
    );
};
