"use client";
import { useEffect, useState } from 'react';
import UserSearch from '@/app/components/User/UserSearch';
import UserFilter from '@/app/components/User/UserFilter';
import UserList from '@/app/components/User/UserList';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  github: string;
  role: string;
  password: string;
  fk_imagesid_images: number;
  gets_assigned: number[];
  applies: number[];
};

export default function Supporter( { params }: { params: { id: number } }) {
  const project_id = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ issue, setIssue ] = useState<any>(null);
  
  // Fetch users from API if they have assignments or registrations
  async function fetchUsers() {
    fetch(`/api/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setUsers(data.users);
    })
    .catch(error => {
      console.error("Error fetching users:", error.message);
    });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Should be good: need to make sure BOTH of the database actions are completed successfully, otherwise, reset and throw an error
  async function handleAssign(user_id: number, issue_id: number) {
    try {
        const response = await fetch(`/api/gets_assigned/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issue_id: issue_id,
                user_id: user_id,
            }),
        });

        if (response.ok) {
          alert('User added to issue successfully');
          console.log('User added to issue');
          fetchUsers();
        } else {
          alert('Failed to add user to issue: ' + response.statusText);
          console.log('Failed to add user to issue' + response.statusText);
        }
    } catch (error) {
      alert('An error occurred while adding user to issue');
      console.error('Failed to add user to issue:', error);
    }
  }

  async function handleRemove(user_id: number, issue_id: number): Promise<void> {
    try {
      const response = await fetch(`/api/gets_assigned/${issue_id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              issue_id: issue_id,
              user_id: user_id,
          }),
      });

      if (response.ok) {
        alert('User removed from issue successfully');
        console.log('User removed from issue');
        fetchUsers();
      } else {
        alert('Failed to remove user from issue: ' + response.statusText);
        console.log('Failed to remove user from issue' + response.statusText);
      }
    } catch (error) {
      alert('An error occurred while removing user from issue');
      console.error('Failed to remove user from issue:', error);
    }
  };

  async function handleCompleted(user_id: number, issue_id: number): Promise<void> {
    // Close issue
    // Remove all users from issue
    try {
      const response = await fetch(`/api/gets_assigned/${issue_id}/update`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (response.ok) {
        alert('Issue status updated successfully');
        console.log('Issue status updated successfully');
        fetchUsers();
      } else {
        alert('Failed to update issue status: ' + response.statusText);
        console.log('Failed to update issue status' + response.statusText);
      }
    } catch (error) {
      alert('An error occurred while updating issue status');
      console.error('Failed to update issue status:', error);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl overflow-y-auto'>
      {/* <UserSearch setSearchTerm={setSearchTerm} /> */}
      {/* <UserFilter users={users} setFilteredUsers={setFilteredUsers} /> */}
      {users.length === 0 ? <div>Nėra rėmėjų</div> :
        <UserList users={users} onAssign={handleAssign} onRemove={handleRemove} onCompleted={handleCompleted} project_id={project_id} />
      }
    </div>
  );
};