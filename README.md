Private repository to manage issues.
Please use this repository only for configuration of the issues.

Some guidance:

For planning we use the ["Molgenis Team" project](https://github.com/orgs/molgenis/projects/15/views/1)

We have created specific fields in this project to manage the board.

1. Team (Armadillo, Catalogue, Dev, Ops, Portal): the team to which this is assigned.
2. Product: The component or product that it belongs to. Different 'apps' in EMX2,
   documentation, emx2-backend, etc.
3. Sprint: The sprint for which it is planned
4. Status: the status of a ticket: Backlog, Blocked, Working, Review, Done

1. We use [labels](https://github.com/molgenis/GCC/labels) to indicate stakeholders:
   specific projects or clusters of projects. An issue can be assigned to multiple
   stakeholders.

The Team, Product, Sprint and Status fields are managed in the ["Molgenis Team" project](https://github.com/orgs/molgenis/projects/15/settings)
settings, while we use [a script](https://github.com/molgenis/molgenis-projects/tree/master/internal/github-sync-labels)
 to create and synchronize labels between the different repositories.

 Currently we synchronize the labels for the following repositories:

 * [GCC](https://github.com/molgenis/GCC)
 * [molgenis-emx2](https://github.com/molgenis/molgenis-emx2)
 * [molgenis-projects](https://github.com/molgenis/molgenis-projects)

Even though it is possible to create new issues in any of these repositories it is
preferred to create them in the GCC repository. External users should be encouraged to
use [Zammad](https://ticket.molgenis.net/#dashboard∏) to create a ticket if they want to report an issue, because that way we can
better follow up on the issue.

