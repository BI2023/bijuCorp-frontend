export default {
    id: "shoe-size-detector",
    title: "Shoe Size Detector",
    description:
        "An AI-powered mobile web application that accurately measures your foot size using your phone's camera, helping you find the perfect shoe fit when shopping online.",
    status: "Idea", // Idea, In Progress, Completed
    tags: ["AI", "Computer Vision", "Python", "Mobile"],
    details: {
        overview:
            "Buying shoes online is convenient, but getting the right size is a constant struggle. The Shoe Size Detector solves this by using advanced computer vision to analyze a photo of your foot. It offers multiple detection approaches ranging from simple camera-based references to advanced LiDAR depth sensing.",
        features: [
            "Camera-Based Detection: Uses computer vision to measure foot length from a photo next to a reference object (e.g., credit card).",
            "Depth / AR-Based Detection: Leverages LiDAR & AR sensors on modern devices for high-precision 3D measurement.",
            "Retail Hardware Support: Integration with pressure mats and foot scanners for retail-grade accuracy.",
            "Instant Size Conversion: Automatically converts measurements to US, UK, EU, and CM sizes.",
            "Brand-Specific Recommendations: Matches your exact measurements to specific brand sizing charts.",
        ],
        technicalStack: [
            "Frontend: React, Tailwind CSS",
            "Computer Vision: OpenCV (Image Processing), MediaPipe (Landmark Detection)",
            "Core Logic: Python, NumPy (Geometry/Calc)",
            "Optional: TensorFlow/PyTorch (ML)",
        ],
        detectionApproaches: [
            {
                title: "A. Camera-Based (Most Common)",
                description: "User takes a photo/video of foot next to a reference object (like a card). Uses computer vision to measure length.",
                tags: ["Computer Vision", "Reference Object"],
            },
            {
                title: "B. Depth / AR-Based (More Accurate)",
                description: "Uses phone depth sensors (LiDAR / AR) for high-precision 3D measurement. Best for modern mobile apps.",
                tags: ["LiDAR", "ARKit/ARCore"],
            },
            {
                title: "C. Foot Scanner Hardware (Retail-grade)",
                description: "External sensors or pressure mats for highest accuracy. Typically used in retail stores.",
                tags: ["Hardware", "High Cost"],
            },
        ],
        roadmap: [
            {
                stage: "Phase 1: Research",
                items: ["Evaluate OpenCV vs MediaPipe", "Prototype edge detection algorithms", "Test reference object scaling"],
                status: "In Progress",
            },
            {
                stage: "Phase 2: MVP Development",
                items: ["Build camera capture interface", "Implement manual reference marker placement", "Develop basic size calculation logic"],
                status: "Planned",
            },
            {
                stage: "Phase 3: Advanced Features",
                items: ["Implement AR-based auto-measurement", "Train custom foot segmentation model", "Integrate brand recommendation API"],
                status: "Planned",
            },
        ],
    },
}
