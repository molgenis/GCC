# GCC project management repository

Please use this repository only for managing issues and project planning.

## Structure

For planning we use the ["Molgenis Team" project](https://github.com/orgs/molgenis/projects/15/views/1)

We have use specific fields in this project to manage the board.

1. Team: the team to which this is assigned;
2. Product: The component or product that it belongs to. Different 'apps' in EMX2,
   documentation, emx2-backend, etc.;
3. Sprint: The sprint for which it is planned;
4. Status: The status of a ticket: Backlog, Blocked, Working, Review, Done;
5. Labels: [Labels](https://github.com/molgenis/GCC/labels) are used to indicate stakeholders.
   A stakeholder is a specific projects or clusters of projects, or internal if we ourselves
   are the main stakeholder. An issue can be assigned to multiple stakeholders.

The Team, Product, Sprint and Status fields are managed in the ["Molgenis Team" project settings](https://github.com/orgs/molgenis/projects/15/settings), while we use [a script](https://github.com/molgenis/molgenis-projects/tree/master/internal/github-sync-labels)
to create and synchronize labels between the different repositories.

## Repositories

Currently we synchronize the labels for the following repositories:

 * [GCC](https://github.com/molgenis/GCC)
 * [molgenis-emx2](https://github.com/molgenis/molgenis-emx2)
 * [molgenis-projects](https://github.com/molgenis/molgenis-projects)

## Creating issues
Even though it is possible to create new issues in any of these repositories it is
preferred to create them in the GCC repository, since this is a private repository so we
don't accidentally expose customer information.

**Note:** Tickets should always be assigned to the "Molgenis Team" project to be
visible on the planning board.

#### External users
External users should be encouraged to use [Zammad](https://ticket.molgenis.net/#dashboard∏)
to create a ticket if they want to report an issue, because that way we can better follow
up on the issue.

