import { ref, watchEffect } from "vue";
import { fileService } from "@/services/fileService";
import defaultProfilePic from "@/assets/img/cat-pfp.png";

export function useProfilePicture(profilePictureData) {
  const profilePictureSrc = ref(defaultProfilePic);
  const loading = ref(false);

  watchEffect(async () => {
    if (!profilePictureData?.uuid) {
      profilePictureSrc.value = defaultProfilePic;
      return;
    }

    try {
      loading.value = true;
      const blob = await fileService.getFile(profilePictureData.uuid);
      profilePictureSrc.value = URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to load profile picture:", error);
      profilePictureSrc.value = defaultProfilePic;
    } finally {
      loading.value = false;
    }
  });

  return {
    profilePictureSrc,
    loading,
  };
}
