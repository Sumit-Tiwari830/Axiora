import React from "react";

/**
 * LinkifyText — Scans a text string for URLs and renders them as clickable
 * anchor tags that open in a new browser tab. Non-URL text is rendered as-is.
 *
 * Used primarily in notice details to make live-class join links clickable.
 */
const URL_REGEX = /(https?:\/\/[^\s|,]+)/g;

const LinkifyText = ({ text }) => {
    if (!text || typeof text !== "string") return text ?? null;

    const parts = text.split(URL_REGEX);

    return (
        <>
            {parts.map((part, index) =>
                URL_REGEX.test(part) ? (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#7c3aed",
                            fontWeight: 600,
                            textDecoration: "underline",
                            wordBreak: "break-all",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        🔗 Join Live Class
                    </a>
                ) : (
                    <React.Fragment key={index}>{part}</React.Fragment>
                )
            )}
        </>
    );
};

export default LinkifyText;
