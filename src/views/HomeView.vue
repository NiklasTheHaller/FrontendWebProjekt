<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-primary-100 to-neutral-100 py-20">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-primary-900 mb-6">LitterBox</h1>
          <p class="text-2xl text-neutral-500 mb-12">
            Share your thoughts, nine lives at a time
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              class="px-8 py-3 bg-primary-600 text-neutral-100 rounded-full hover:bg-primary-700 transition-all transform hover:-translate-y-1"
            >
              Get Started
            </button>
            <button
              class="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-full hover:bg-primary-50 transition-all transform hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 max-w-6xl">
        <h2 class="text-4xl font-bold text-center text-neutral-600 mb-16">
          Why Choose Litterbox?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="bg-neutral-200 rounded-xl p-8 text-center transition-all hover:-translate-y-2"
          >
            <i class="fas fa-bolt text-4xl text-primary-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-neutral-600 mb-3">
              Quick & Simple
            </h3>
            <p class="text-neutral-500">Share your thoughts in seconds</p>
          </div>
          <div
            class="bg-neutral-200 rounded-xl p-8 text-center transition-all hover:-translate-y-2"
          >
            <i class="fas fa-users text-4xl text-primary-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-neutral-600 mb-3">
              Community First
            </h3>
            <p class="text-neutral-500">Connect with like-minded people</p>
          </div>
          <div
            class="bg-neutral-200 rounded-xl p-8 text-center transition-all hover:-translate-y-2"
          >
            <i class="fas fa-lock text-4xl text-primary-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-neutral-600 mb-3">
              Privacy Focused
            </h3>
            <p class="text-neutral-500">You're in control of your data</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: "HomeView",
    components: {},
  };
</script>

<style scoped></style>
