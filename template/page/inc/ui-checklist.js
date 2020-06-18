'use strict';

module.exports = (_, model) => `

<h1>Login</h1>
<ul>
    <li>Logging in</li>
    <li>Upon first time setup, a user can create an admin account</li>
    <li>Upon invited, the user can create their account
        <ul>
            <li>If invite is expired, a message appears</li>
        </ul>
    </li>
</ul>
<h1>Dashboard</h1>
<ul>
    <li>Can log out</li>
</ul>
<h2>Projects</h2>
<ul>
    <li>Admin related content appears</li>
    <li>Can delete a project</li>
    <li>Can create a new project</li>
</ul>
<h3>Project</h3>
<ul>
    <li>Name is correct</li>
    <li>Amount of users is correct</li>
    <li>Amount of languages is correct</li>
</ul>
<h4>Info</h4>
<ul>
    <li>Can change the project name</li>
</ul>
<h4>Languages</h4>
<ul>
    <li>Can change languages</li>
</ul>
<h4>Backups</h4>
<ul>
    <li>List of backups appear</li>
    <li>Can upload a new backup</li>
    <li>Can create a new backup</li>
    <li>Can download an existing backup</li>
    <li>Can restore an existing backup</li>
    <li>Can delete an existing backup</li>
</ul>
<h4>Migration</h4>
<ul>
    <li>All types are migrated correctly</li>
    <li>Content is overwritten on target if intended</li>
</ul>
<h4>Sync</h4>
<ul>
    <li>Can enable/disable sync</li>
    <li>Can input API URL</li>
    <li>Can generate API token</li>
    <li>Can specify remote project</li>
</ul>
<h4>Environments</h4>
<ul>
    <li>Amount is correct</li>
    <li>Can add a new environment</li>
    <li>Can delete an existing environment</li>
</ul>
<h2>Users</h2>
<ul>
    <li>Can create a new user
        <ul>
            <li>Can create without inviting through email</li>
            <li>Can invite through email</li>
        </ul>
    </li>
    <li>Can delete an existing user</li>
</ul>
<h3>Edit user</h3>
<ul>
    <li>Can change username</li>
    <li>Can change full name</li>
    <li>Can change email</li>
    <li>Can change password</li>
    <li>Can set as admin</li>
    <li>Can modify scopes for all projects</li>
</ul>
<h2>Server</h2>
<ul>
    <li>Information is correct</li>
</ul>
<h2>Log out</h2>
<ul>
    <li>Clears cookies</li>
    <li>Removes user session from database</li>
</ul>
<h2>Update</h2>
<ul>
    <li>Version check is correct</li>
</ul>
<h1>Environment</h1>
<h2>Main menu</h2>
<ul>
    <li>Can navigate to dashboard</li>
    <li>Can change user settings (see dashboard > user checklist)</li>
    <li>Can log out</li>
    <li>Can invoke the "help" modal
        <ul>
            <li>Context sensitive information is displayed in the modal</li>
        </ul>
    </li>
    <li>Langage selector appears, if some than one language is selected</li>
    <li>Can change language
        <ul>
            <li>Navbar items are updated</li>
            <li>Content currently being edited is being updated</li>
        </ul>
    </li>
</ul>
<h2>Content</h2>
<h3>Navbar</h3>
<ul>
    <li>Can create new Content
        <ul>
            <li>In the root</li>
            <li>As a child of other Content, limited by Schema's allowed child Schemas</li>
        </ul>
    </li>
    <li>Can copy the Content id</li>
    <li>Can pull Content from remote</li>
    <li>Can push Content to remote</li>
    <li>Can remove Content if it's local</li>
    <li>Can expand Content to see child Content</li>
    <li>Can move Content in between and nested under other nodes
        <ul>
            <li>The order is maintained upon reload</li>
        </ul>
    </li>
</ul>
<h3>Editor</h3>
<ul>
    <li>Default tab for the Schema is routed to correctly</li>
    <li>Cannot edit Content that is locked or remote
        <ul>
            <li>There is no "save &" button</li>
            <li>Fields are half transparent and not interactable</li>
        </ul>
    </li>
    <li>Tabs are displaying correct fields as defined in the Schema</li>
    <li>Can save edited Content
        <ul>
            <li>Spinner icon and "working" text appears while in progress</li>
            <li>Can publish</li>
            <li>Can preview</li>
            <li>Can unpublish</li>
            <li>All publishing operations are performed through the associated publications</li>
        </ul>
    </li>
    <li>Fields from parent Schemas are visible in the editor</li>
</ul>
<h3>Field types</h3>
<ul>
    <li>Array
        <ul>
            <li>Can change Schema of an item</li>
            <li>Can collapse all items</li>
            <li>Can expand all items</li>
            <li>Can sort items</li>
            <li>All items are saved in correct order and with correct Schemas</li>
        </ul>
    </li>
    <li>Date
        <ul>
            <li>Can define date with modal</li>
            <li>Can delete date</li>
        </ul>
    </li>
    <li>Dropdown
        <ul>
            <li>Options are displaying</li>
            <li>Can pick options</li>
        </ul>
    </li>
    <li>Language
        <ul>
            <li>Languages are displaying</li>
            <li>Can pick a language</li>
        </ul>
    </li>
    <li>Media reference
        <ul>
            <li>Can pick Media object from the MediaBrowser</li>
        </ul>
    </li>
    <li>Content Schema Reference
        <ul>
            <li>Can pick ContentSchema</li>
        </ul>
    </li>
    <li>Resource Reference
        <ul>
            <li>Resource is being displayed by label (like name, title or id)</li>
        </ul>
    </li>
    <li>Rich Text
        <ul>
            <li>Value is stored in HTML form</li>
            <li>Changing between tabs doesn't trigger a change</li>
            <li>Can insert Media from the MediaBrowser</li>
        </ul>
    </li>
    <li>String
        <ul>
            <li>Can change string</li>
        </ul>
    </li>
    <li>Struct
        <ul>
            <li>All correctly defined fields are displaying</li>
            <li>If fields are defined incorrectly, an error message appears</li>
        </ul>
    </li>
    <li>Tags
        <ul>
            <li>Can remove tags</li>
            <li>Can add tags</li>
        </ul>
    </li>
    <li>Content Reference
        <ul>
            <li>Can pick a Content node using the dropdown</li>
        </ul>
    </li>
    <li>Boolean
        <ul>
            <li>Can toggle the switch on/off</li>
        </ul>
    </li>
    <li>Url
        <ul>
            <li>Can change the URL</li>
            <li>The editor is updated automatically upon changing the "title" field on a Page Schema</li>
        </ul>
    </li>
    <li>Number
        <ul>
            <li>The field is limited to numbers</li>
        </ul>
    </li>
</ul>
<h2>Media</h2>
<h3>Navbar</h3>
<ul>
    <li>Can upload new Media</li>
    <li>Can replace Media</li>
    <li>Can move Media into new folders</li>
    <li>Can copy the Media id</li>
    <li>Can remove Media</li>
    <li>Folder structure displays correctly
        <ul>
            <li>Expand/collapse toggle</li>
            <li>Sorted alphabetically</li>
        </ul>
    </li>
</ul>
<h3>Browser</h3>
<ul>
    <li>All media is displayed in folders</li>
    <li>Can upload new media</li>
</ul>
<h3>Editor</h3>
<ul>
    <li>Can view SVG, image and video files</li>
</ul>
<h2>Forms</h2>
<h3>Navbar</h3>
<ul>
    <li>Can copy Form id</li>
    <li>Can remove Form</li>
    <li>Can pull from remote</li>
    <li>Can push to remote</li>
</ul>
<h3>Editor</h3>
<ul>
    <li>Can see amount of entries</li>
    <li>Can clear entires</li>
    <li>Can download entries as CSV</li>
    <li>Can see timestamps on all entries</li>
    <li>Can copy the generated POST URL</li>
    <li>Can change the title</li>
    <li>Can set the allowed origin</li>
    <li>Can set redirect URL</li>
    <li>Can toggle whether the redirect URL is appended</li>
    <li>Can define inputs
        <ul>
            <li>Can set input name</li>
            <li>Can set input type</li>
            <li>Can toggle "required" attribute</li>
            <li>Can toggle "check for duplicates"</li>
            <li>Can define regex pattern</li>
            <li>Test form updates as fields are updated</li>
        </ul>
    </li>
</ul>
<h3>Submissions</h3>
<ul>
    <li>Submissions are only accepted from the allowed origin</li>
    <li>Submissions are timestamped</li>
    <li>Submissions enter the database correctly</li>
    <li>If a redirect is specified, it is carried out successfully upon submission
        <ul>
            <li>If the redirect is appended, it is done so as well</li>
        </ul>
    </li>
    <li>If "check for duplicates" is checked, no duplicates are allowed</li>
    <li>If a regex pattern is defined, it is checked properly</li>
</ul>
<h2>Publications</h2>
<h3>Publishing</h3>
<ul>
    <li>Can publish content with every deployer type</li>
    <li>Can unpublish content with every deloyer type</li>
</ul>
<h3>Navbar</h3>
<ul>
    <li>Can create new publication</li>
    <li>Can copy publication id</li>
    <li>Can remove publication</li>
    <li>Can push publication to remote</li>
    <li>Can pull publication from remote</li>
</ul>
<h3>Editor</h3>
<ul>
    <li>Can edit title</li>
    <li>Can edit URL</li>
    <li>Can change type
        <ul>
            <li>The types are loaded from plugins</li>
            <li>Upon changing the type, the plugin editor renders immediately</li>
        </ul>
    </li>
    <li>Can save changes</li>
</ul>
<h2>Schemas</h2>
<h3>Navbar</h3>
<ul>
    <li>Schemas are divided into "Content Base" and "Field Base"</li>
    <li>Can copy Schema id</li>
    <li>Can create new child Schema</li>
    <li>Can pull Schema from remote</li>
    <li>Can push Schema to remote</li>
    <li>Can remove Schema</li>
</ul>
<h3>Editor</h3>
<ul>
    <li>Can change name</li>
    <li>Can change icon</li>
    <li>Can change parent
        <ul>
            <li>Changes are reflected in the navbar immediately</li>
        </ul>
    </li>
    <li>Can change field editor</li>
    <li>Can change config</li>
    <li>Can save changes</li>
</ul>

`
