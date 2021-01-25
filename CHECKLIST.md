This is a checklist for manual testing

Pages
====================

## Login

* Users can log in with their username and password
* Upon first time setup, a user can create an admin account

## Dashboard

* Users can log out
    * Clears cookies
    * Removes user session from database
* Users can open the user settings modal
* Admins
    * Can create a new project
    * Can see list of users
    * Can see server info

## Users

* Can create a new user
    * Can create without inviting via email
    * Can invite via email

## Server

* Information is correct
* Plugins are listed


Modals
====================

## MigrateEnvironments

* All resource types are migrated correctly

## ProjectBackups

* List of backups appears
* Can upload a new backup
* Can create a new backup
* Can download an existing backup
* Can restore an existing backup
* Can delete an existing backup

## ProjectSettings

* Information in fields is correct
* Can enable sync and acquire tokens
* Changes are saved correctly

## UserEditor

* Can change username
* Can change full name
* Can change email
* Can change password
* Can set as admin
* Can modify scopes for all projects


ListItems
====================

## Project

* Information in fields is correct
* Can add a new environment
* Can delete an existing environment
* Can open the MigrateEnvironments modal
* Can delete project

## User

* Can delete an existing user
* Can open the UserEditor modal


Navigation
====================

## Session

* Can navigate to dashboard
* Can open the UserEditor modal
* Can log out
* Locale selector appears, if some than one locale is selected
* Can change locale
    * ResourceBrowser items are updated
    * Content currently being edited is updated

## ResourceBrowser

* Can create new resources
* Can copy the resource id
* Can pull the resource from remote
* Can push the resource to remote
* Can remove the resource if it's local
* Can expand the resource to see children


Fields
====================

## ArrayEditor

* Can change schema of an item
* Can collapse all items
* Can expand all items
* Can sort items
* All items are saved in correct order and with correct schemas

## BooleanEditor

* Value is always saved as either true or false

## ContentReferenceEditor

* Can pick content

## ContentSchemaReferenceEditor

* Can pick content schema

## DateEditor

* Can define date
* Can clear date

## DropdownEditor

* Options are displaying
* Can pick options

## LocaleEditor

* Locales are displaying
* Can pick a locale

## MediaReferenceEditor

* Can pick media from the MediaBrowser

## NumberEditor

* The field is limited to numbers

## RichTextEditor

* Value is stored in HTML format
* Changing between HTML/Markdown and WYSIWYG doesn't trigger a change
* Can insert media from the MediaBrowser

## StringEditor

* Can change string

## StructEditor

* All correctly defined fields are displaying
* If fields are defined incorrectly, an error message appears

## TagsEditor

* Can remove tags
* Can add tags

## UrlEditor
 
* Can change the URL
* The editor is updated automatically upon changing the "title" field on the parent editor


Content
====================

## ContentPanel

* Can create new content
    * In the root, if allowed in the schema
    * As a child, if allowed by the parent schema
* Can reparent content
* Can copy the content id
* Can remove content

## ContentEditor

* Fields are displayed in their appropriate tabs
* Parent fields are displayed in content with inherited schemas
* Values are saved correctly
* The published checkbox publishes/redacts content as expected


Media
====================

## MediaPanel

* Can upload new media
* Can replace media
* Can move media into new folders
* Can copy the media id
* Can remove media
* Folder structure displays correctly
    * Expand/collapse toggle
    * Sorted alphabetically

### MediaEditor

* Can view SVG, image and video files
* Can change folder
* Can change authoring and copyright information


Publications
====================

## PublicationPanel

* Can create new publications
* Can copy the publication id
* Can remove publication

## PublicationEditor

* Preview link points to the correct API publication endpoint
* Output matches filtering criteria, if any are provided


Schemas
====================

## SchemaPanel

* Schemas are divided into "Content" and "Field"
* Can copy schema id
* Can create new child schema
* Can pull schema from remote
* Can push schema to remote
* Can remove schema

## SchemaEditor

* Can change name
* Can change icon
* Can change parent
    * Changes are reflected in the SchemaPanel immediately
* Can change field editor
* Can change config
* Can save changes
