import { profileService } from "../services/profile.service.js";
import { processResumeFile } from "../services/resume.service.js";

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await profileService.getProfileByUserId(Number(userId));

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ error: error.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    const newProfile = await profileService.createProfile(Number(userId), profileData);

    return res.status(201).json({
      message: "Profile successfully created",
      profile: newProfile[0],
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(400).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    const updatedProfile = await profileService.updateProfile(Number(userId), profileData);

    return res.status(200).json({
      message: "Profile successfully updated",
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    await profileService.deleteProfile(Number(userId));

    return res.status(200).json({ message: "Profile successfully deleted" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const uploadAndProcessResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.params;
    const extractedData = await processResumeFile(req.file);
    
    if (extractedData.error) {
        return res.status(500).json({ error: extractedData.error });
    }

    const result = await profileService.saveExtractedResumeData(Number(userId), extractedData);

    res.json({ success: true, data: extractedData, dbResult: result });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error processing resume" });
  }
};

export const profileController = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  uploadAndProcessResume,
};
