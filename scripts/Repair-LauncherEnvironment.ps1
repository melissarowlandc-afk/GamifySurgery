function Repair-LauncherProcessEnvironment {
    $processEnvironment = [Environment]::GetEnvironmentVariables(
        [EnvironmentVariableTarget]::Process
    )
    $pathEntries = @(
        $processEnvironment.GetEnumerator() |
            Where-Object {
                [string]::Equals(
                    [string]$_.Key,
                    "Path",
                    [StringComparison]::OrdinalIgnoreCase
                )
            }
    )

    if ($pathEntries.Count -le 1) {
        return
    }

    $pathParts = [Collections.Generic.List[string]]::new()
    $seenPathParts = [Collections.Generic.HashSet[string]]::new(
        [StringComparer]::OrdinalIgnoreCase
    )
    foreach ($entry in $pathEntries) {
        foreach ($pathPart in ([string]$entry.Value).Split([IO.Path]::PathSeparator)) {
            $trimmedPathPart = $pathPart.Trim()
            if ($trimmedPathPart -and $seenPathParts.Add($trimmedPathPart)) {
                $pathParts.Add($trimmedPathPart)
            }
        }
    }

    foreach ($entry in $pathEntries) {
        [Environment]::SetEnvironmentVariable(
            [string]$entry.Key,
            $null,
            [EnvironmentVariableTarget]::Process
        )
    }
    [Environment]::SetEnvironmentVariable(
        "Path",
        ($pathParts -join [IO.Path]::PathSeparator),
        [EnvironmentVariableTarget]::Process
    )
}
