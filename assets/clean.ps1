param (
    [Parameter(Mandatory=$true)]
    [string]$Path
)

# Define the files to search for
$filesToSearch = ".env.local", ".env.local.user", ".env.dev", ".env.dev.user"

# Define the keys to ignore
$keysToIgnore = "SPO_HOSTNAME", "SPO_SITE_URL", "APP_NAME_SUFFIX"

# Define the directory to ignore
$dirToIgnore = "node_modules"

# Iterate over each directory named 'env' in the directory and its subdirectories
Get-ChildItem -Path $Path -Recurse -Directory -Filter 'env' | ForEach-Object {
    # Get the full path of the 'env' directory
    $envDir = $_.FullName

    # Check if the path contains the directory to ignore
    if ($envDir -notmatch $dirToIgnore) {
        # Iterate over each file in the 'env' directory
        foreach ($file in $filesToSearch) {
            $filePath = Join-Path -Path $envDir -ChildPath $file
            if (Test-Path -Path $filePath) {
                # Read the contents of the file
                $content = Get-Content $filePath

                # Create a new array to hold the updated content
                $updatedContent = @()

                # Iterate over each line in the file
                foreach ($line in $content) {
                    # Ignore lines that start with '#' or are empty or only contain '='
                    if (($line -notmatch '^#') -and ($line -match '\S') -and ($line -ne '=')) {
                        # Split the line into key and value
                        $keyValue = $line -split "="

                        # Check if the key is not in the ignore list
                        if ($keyValue[0] -notin $keysToIgnore) {
                            # Remove the value
                            $updatedContent += $keyValue[0] + "="
                        } else {
                            # Keep the original line
                            $updatedContent += $line
                        }
                    }
                }

                # Write the updated content back to the file
                Set-Content -Path $filePath -Value $updatedContent
            }
        }
    }
}
