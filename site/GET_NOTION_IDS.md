# How to Get Notion Database IDs

## Step 1: Create the Databases in Notion

### Projects Database
1. Create a new database in Notion
2. Add these properties:
   - **Name** (Title)
   - **Status** (Select: Discovery, In Progress, Review, Complete)
   - **Token** (Rich Text)
   - **Client Name** (Rich Text)
   - **Start Date** (Date)
   - **Target Completion** (Date)
   - **Deliverables Link** (URL)
   - **Internal Notes** (Rich Text) - optional, not shown to clients

### Updates Database
1. Create another database in Notion
2. Add these properties:
   - **Title** (Title)
   - **Project** (Relation → Link to Projects database)
   - **Message** (Rich Text)
   - **Type** (Select: Progress, Milestone, Question, Feedback, FYI)
   - **From** (Select: Studio, Client)
   - **Date** (Date)

## Step 2: Get the Database ID

1. Open your database in Notion
2. Click the "..." menu (top right)
3. Click "Copy link"
4. The URL looks like: `https://www.notion.so/workspace/[DATABASE_ID]?v=...`
5. Copy the `[DATABASE_ID]` part (32 characters, alphanumeric)

Example:
- URL: `https://www.notion.so/workspace/abc123def456ghi789jkl012mno345pq?v=...`
- Database ID: `abc123def456ghi789jkl012mno345pq`

## Step 3: Share Databases with Integration

1. In each database, click "Share" (top right)
2. Click "Invite" or "Add people"
3. Search for your integration name (the one you created at notion.so/my-integrations)
4. Add it with "Can edit" permissions
