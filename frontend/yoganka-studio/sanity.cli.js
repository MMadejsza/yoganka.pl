import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'b7wo2my9',
    dataset: 'production',
  },
  studioHost: 'yogankacms',
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  // autoUpdates: true,
})
