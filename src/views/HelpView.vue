<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Help & FAQs</h1>
    <div class="space-y-4">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border-b border-gray-300"
      >
        <button
          @click="toggleAccordion(index)"
          class="w-full text-left py-3 flex justify-between items-center focus:outline-none"
        >
          <span class="text-lg font-medium text-gray-800">{{ faq.question }}</span>
          <svg
            :class="{ 'transform rotate-180': activeIndex === index }"
            class="w-5 h-5 text-gray-600 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          v-show="activeIndex === index"
          class="py-2 text-gray-700 transition-all duration-300"
        >
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpView',
  data() {
    return {
      faqs: [
        {
          question: 'How do I register and log in?',
          answer: 'To register, click on the "Register" button at the top of the page and fill in your details. To log in, use the "Login" button and provide your credentials.',
        },
        {
          question: 'How can I create a post?',
          answer: 'Once logged in, you can create a post by clicking the "New Post" button on your feed page. Fill in the details and click "Submit".',
        },
        {
          question: 'How do I edit my profile?',
          answer: 'To edit your profile, go to your profile page by clicking on your username in the top right corner. Then, click on "Edit Profile" and update your information.',
        },
        {
          question: 'How do I contact support?',
          answer: 'You can contact support by sending an email to support@example.com or using the contact form on the support page.',
        },
      ],
      activeIndex: null,
    };
  },
  methods: {
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
/* Optional custom styling can be added here */
</style>
