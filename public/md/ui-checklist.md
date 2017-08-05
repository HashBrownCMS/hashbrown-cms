# Login
- Logging in
- Upon first time setup, a user can create an admin account
- Upon invited, the user can create their account
  - If invite is expired, a message appears

# Dashboard
- Can log out

## Projects
- Admin related content appears
- Can delete a project
- Can create a new project

### Project
- Name is correct
- Amount of users is correct
- Amount of languages is correct

#### Info
- Can change the project name

#### Languages
- Can change languages

#### Backups
- List of backups appear
- Can upload a new backup
- Can create a new backup
- Can download an existing backup
- Can restore an existing backup
- Can delete an existing backup

#### Migration
- All types are migrated correctly
- Content is overwritten on target if intended

#### Sync
- Can enable/disable sync
- Can input API URL
- Can generate API token
- Can specify remote project

#### Environments
- Amount is correct
- Can add a new environment
- Can delete an existing environment

## Users
- Can create a new user
  - Can create without inviting through email
  - Can invite through email
- Can delete an existing user

### Edit user
- Can change username
- Can change full name
- Can change email
- Can change password
- Can set as admin
- Can modify scopes for all projects

## Server
- Information is correct
- Can restart instance

## Log out
- Clears cookies
- Removes user session from database

## Update
- Version check is correct
- Can perform update
- Update was pulled from stable branch

# Environment
## Main menu
- Can navigate to dashboard
- Can change user settings (see dashboard > user checklist)
- Can log out
- Can invoke the "help" modal
  - Context sensitive information is displayed in the modal
- Langage selector appears, if some than one language is selected
- Can change language
  - Navbar items are updated
  - Content currently being edited is being updated

## HashBrown
- Informational pages are displayed correctly

## Content
### Navbar
- Can create new Content
  - In the root
  - As a child of other Content, limited by Schema's allowed child Schemas
- Can copy the Content id
- Can pull Content from remote
- Can push Content to remote
- Can remove Content if it's local
- Can expand Content to see child Content
- Can move Content in between and nested under other nodes
  - The order is maintained upon reload
- Can change publishing settings
  - Apply settings to children
  - Connections appear as options

### Editor
- Default tab for the Schema is routed to correctly
- Cannot edit Content that is locked or remote
  - There is no "save &" button
  - Fields are half transparent and not interactable
- Tabs are displaying correct fields as defined in the Schema
- Can save edited Content
  - Spinner icon and "working" text appears while in progress
  - Can publish
  - Can preview
  - Can unpublish
  - All publishing operations are performed through the associated Connections
- Publishing operations are hidden when no Connection is set in the Content's publishing settings
- Fields from parent Schemas are visible in the editor

### Field types
- Array 
  - Can change Schema of an item
  - Can collapse all items
  - Can expand all items
  - Can sort items
  - All items are saved in correct order and with correct Schemas
- Date
  - Can define date with modal
  - Can delete date
- Dropdown
  - Options are displaying
  - Can pick options
- Language
  - Languages are displaying
  - Can pick a language
- Media reference
  - Can pick Media object from the MediaBrowser
- Content Schema Reference
  - Can pick ContentSchema
- Resource Reference
  - Resource is being displayed by label (like name, title or id)
- Rich Text
  - Value is stored in HTML form
  - Changing between HTML/Markdown and WYSIWYG doesn't trigger a change
  - Can insert Media from the MediaBrowser
- String
  - Can change string
- Struct
  - All correctly defined fields are displaying
  - If fields are defined incorrectly, an error message appears
- Tags
  - Can remove tags
  - Can add tags
- Content Reference
  - Can pick a Content node using the dropdown
- Template reference
  - Can pick a Template provided by a Connection
  - If no Connection is set up to provide Templates, a warning message appears
- Boolean
  - Can toggle the switch on/off
- Url
  - Can change the URL
  - The editor is updated automatically upon changing the "title" field on a Page Schema
- Number
  - The field is limited to numbers

## Media
### Navbar
- Can upload new Media
- Can replace Media
- Can move Media into new folders
- Can copy the Media id
- Can remove Media
- Folder structure displays correctly
  - Expand/collapse toggle
  - Sorted alphabetically

### Editor
- Can view SVG, image and video files

## Forms
### Navbar
- Can copy Form id
- Can remove Form
- Can pull from remote
- Can push to remote

### Editor
- Can see amount of entries
- Can clear entires
- Can download entries as CSV
- Can see timestamps on all entries
- Can copy the generated POST URL
- Can change the title
- Can set the allowed origin
- Can set redirect URL
- Can toggle whether the redirect URL is appended
- Can define inputs
  - Can set input name
  - Can set input type
  - Can toggle "required" attribute
  - Can toggle "check for duplicates"
  - Can define regex pattern
  - Test form updates as fields are updated

### Submissions
- Submissions are only accepted from the allowed origin
- Submissions are timestamped
- Submissions enter the database correctly
- If a redirect is specified, it is carried out successfully upon submission
  - If the redirect is appended, it is done so as well
- If "check for duplicates" is checked, no duplicates are allowed
- If a regex pattern is defined, it is checked properly

## Templates
### Navbar
- Can copy Template id
- Can remove Template
- Can rename Template
- Templates are sorted into "Partials" and "Pages"
- [PENDING] Templates are sorted into appropriate subdirectories

### Editor
- Can edit template and save it

## Connections
### Publishing
- Can publish Content with every Connection type
- Can unpublish Content with every Connection type
- Can preview Content with every Connection type
- Can see and edit Templates with every Connection type
- Can see and edit Media with every Connection type

### Navbar
- Can create new Connection
- Can copy Connection id
- Can remove Connection
- Can push Connection to remote
- Can pull Connection from remote

### Editor
- Can set as Template provider
- Can set as Media provider
- Can edit title
- Can edit URL
- Can change type
  - The types are loaded from plugins
  - Upon changing the type, the plugin editor renders immediately
- Can save changes

## Schemas
### Navbar
- Schemas are divided into "Content Base" and "Field Base"
- Can copy Schema id
- Can create new child Schema
- Can pull Schema from remote
- Can push Schema to remote
- Can remove Schema

### Editor
- Can change name
- Can change icon
- Can change parent
  - Changes are reflected in the navbar immediately
- Can change field editor
- Can change config
- Can change preview template
- Can save changes
