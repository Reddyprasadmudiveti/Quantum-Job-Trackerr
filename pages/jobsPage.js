import Job from "../database/jobsSchema.js";

export const getJobs = async (req, res) => {
    try {
        // Get pagination parameters from query, default to page 1 and 10 items per page
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count of documents and jobs in parallel
        const [totalJobs, jobs] = await Promise.all([
            Job.countDocuments({}),
            Job.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select({
                    url: 1,
                    _id: 1,
                    tittle: 1, // Note: Schema has 'tittle' instead of 'title'
                    location: 1,
                    id: 1,
                    description: 1,
                    company: 1,
                    createdAt: 1,
                    updatedAt: 1
                })
                .lean()
        ]);

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                jobs: [],
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit),
                totalJobs,
                jobsPerPage: limit
            });
        }

        // Transform jobs to match required format
        const formattedJobs = jobs.map(job => ({
            title: job.tittle || "No title available", // Convert 'tittle' to 'title' in response
            location: job.location || "No location available", 
            id: job.id || job._id.toString(),
            url: job.url || "",
            description: job.description || "No description available",
            company: job.company || "IBM"
        }));

        return res.status(200).json({
            jobs: formattedJobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs,
            jobsPerPage: limit
        });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}