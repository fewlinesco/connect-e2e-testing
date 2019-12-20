package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	args := os.Args[1:]
	branch := args[0]
	env := os.Getenv("APP_ENV")

	if env == "" {
		env = getEnvFromBranch(branch)
	}

	fmt.Printf("%s=%v\n", "APP_ENV", env)
}

func getEnvFromBranch(branch string) string {
	if branch == "master" {
		return "prod"
	}

	return "r" + strings.Split(branch, "-")[0]
}
