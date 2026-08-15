export const links = {
  email: 'sahilkolwankar@gmail.com',
  resume: '/resume.pdf',
  linkedIn: 'https://www.linkedin.com/in/sahil-kolwankar-0285915b/',
  github: 'https://github.com/sahilkolwankar',
  youtube: 'https://www.youtube.com/channel/UCRjEa7CLM6MMIv_C6R10vzg',
  tvReviews: 'https://nerdreviewstv.blogspot.com/',
  twitter: 'https://x.com/sahilvkolwankar',
  instagram: 'https://www.instagram.com/sahilkolwankar.manylenses/',
}

export const location = 'East Bay, CA'

// The name now lives in a static <h1> (see Hero.tsx), so this rotation no longer repeats it.
export const greetings = [
  "I'm glad you're here.",
  'I like building problems.',
  'Wait, no.',
  'I like building THINGS.',
  'I like SOLVING problems.',
]

// Parallel to `greetings` - how long each phrase holds before it starts deleting.
export const greetingHolds = [1500, 350, 650, 1000, 2200]

// Parallel to `greetings` - per-character delete speed, in ms. "I like building problems." deletes in a hurry.
export const greetingDeletes = [30, 12, 30, 30, 30]

// Parallel to `greetings` - per-character type speed, in ms. "Wait, no." snaps out fast.
export const greetingTypes = [55, 55, 20, 55, 55]
