# template-adapter-github

The template to use when creating new github repositories for github adapters

# Local testing

You can run the github workflow locally https://github.com/nektos/act
`act -j issue-credential --secret-file .secrets`

Please review their documentation before using this action.

## GitHub Side

<img src="./workflow-run.png" />

## Transmute Side

<img src="./platform-credential.png" />

### Setup

```shell
./env-to-repo-secrets.sh .env
```

<img src="./set-secrets.png" />

### Examples

See [issue-credential.yml](./.github/workflows/issue-credential.yml)
