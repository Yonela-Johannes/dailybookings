import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: '#33689C',
        'tape-mustard': '#e0a639',
        'tape-teal': '#3f7d74',
        'tape-plum': '#8e6a8a',
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
      },
    }
  }
}
