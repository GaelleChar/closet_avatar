#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAXIMAL_PEOPLE 10
#define MAXIMAL_STRING_LENGTH 128

typedef char string[MAXIMAL_STRING_LENGTH];

typedef struct personTag {
    string name;
    int age;
    struct personTag *bestFriend;
} personType;

typedef personType *personPointer;
typedef personPointer peoplePointers[MAXIMAL_PEOPLE];

personPointer findPersonByName(peoplePointers people, int count, const char *name) {
    for (int i = 0; i < count; i++) {
        if (strcmp(people[i]->name, name) == 0) {
            return people[i];
        }
    }
    return NULL;
}

int main() {
    peoplePointers people = {NULL};
    int count = 0;

    // Reading in people's information
    while (count < MAXIMAL_PEOPLE) {
        char nameInput[MAXIMAL_STRING_LENGTH];
        char ageInput[10];
        
        printf("Please enter person name, \"exit\" to exit: ");
        fgets(nameInput, sizeof(nameInput), stdin);
        nameInput[strcspn(nameInput, "\n")] = 0; 
        
        if (strcmp(nameInput, "exit") == 0) {
            break;
        }

        printf("Please enter %s's age: ", nameInput);
        fgets(ageInput, sizeof(ageInput), stdin);
        int age = atoi(ageInput);

        // Allocate memory for person
        personPointer newPerson = (personPointer)malloc(sizeof(personType));
        if (newPerson == NULL) {
            fprintf(stderr, "Memory allocation failed\n");
            return EXIT_FAILURE;
        }
        strcpy(newPerson->name, nameInput);
        newPerson->age = age;
        newPerson->bestFriend = NULL;

        // Add person to array
        people[count++] = newPerson;
    }

    // Assigning best friends
    for (int i = 0; i < count; i++) {
        char friendName[MAXIMAL_STRING_LENGTH]; // Same as nameInput
        printf("Who is %s's best friend? ", people[i]->name);
        fgets(friendName, sizeof(friendName), stdin);
        friendName[strcspn(friendName, "\n")] = 0;

        personPointer bestFriend = findPersonByName(people, count, friendName);
        if (bestFriend != NULL) {
            people[i]->bestFriend = bestFriend;
        } else {
            printf("Best friend %s not found.\n", friendName);
        }
    }

    // Print all people's information
    printf("\n--- People's Information ---\n");
    for (int i = 0; i < count; i++) {
        printf("%-15s is %3d", people[i]->name, people[i]->age);
        if (people[i]->bestFriend != NULL) {
            printf(", and their best friend is %s", people[i]->bestFriend->name);
        }
        printf("\n");
    }

    // Free allocated memory
    for (int i = 0; i < count; i++) {
        free(people[i]);
    }

    return EXIT_SUCCESS;
}
