import { defineStore } from "pinia";
import { fileService } from "../services/fileService";

export const useFileStore = defineStore("file", {
  state: () => ({
    currentFile: null,
    loading: false,
    error: null,
  }),

  actions: {
    async uploadFile(file) {
      this.loading = true;
      this.error = null;

      try {
        const result = await fileService.uploadFile(file);
        this.files.push(result);
        return result;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async downloadFile(uuid) {
      try {
        this.loading = true;
        this.error = null;
        const blob = await fileService.getFile(uuid);
        this.currentFile = blob;
        return blob;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteFile(uuid) {
      try {
        this.loading = true;
        this.error = null;
        await fileService.deleteFile(uuid);
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
