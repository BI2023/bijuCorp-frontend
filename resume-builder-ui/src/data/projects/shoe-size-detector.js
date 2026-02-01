export default {
    id: "shoe-size-detector",
    title: "Shoe Size Detector",
    description:
        "An AI-powered mobile web application that accurately measures your foot size using your phone's camera, helping you find the perfect shoe fit when shopping online.",
    status: "Idea", // Idea, In Progress, Completed
    tags: ["AI", "Computer Vision", "React", "Mobile"],
    details: {
        overview:
            "Buying shoes online is convenient, but getting the right size is a constant struggle. Sizes vary between brands, and measuring your own feet accurately is difficult. The Shoe Size Detector solves this by using computer vision to analyze a photo of your foot (next to a standard reference object like a credit card or coin) and calculate precise dimensions.",
        features: [
            "Camera-based foot measurement",
            "Automatic reference object detection",
            "Instant size conversion (US, UK, EU, CM)",
            "Brand-specific size recommendations",
            "History of saved profiles for family members",
        ],
        technicalStack: [
            "Frontend: React, Tailwind CSS",
            "Computer Vision: OpenCV.js or TensorFlow.js",
            "State Management: Context API",
        ],
        roadmap: [
            {
                stage: "Phase 1: Research",
                items: ["Evaluate CV libraries", "Prototype edge detection", "Design UI mockups"],
                status: "In Progress",
            },
            {
                stage: "Phase 2: MVP",
                items: ["Basic camera capture", "Manual reference placement", "Simple size calculation"],
                status: "Planned",
            },
        ],
    },
}
