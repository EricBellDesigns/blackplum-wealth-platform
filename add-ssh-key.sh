#!/bin/bash
# This script will run once when the instance starts

# Add your SSH public key here (replace with your actual key)
# To get your public key, run: cat ~/.ssh/id_rsa.pub
SSH_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCmAJKcNJiJ6HXMvCA4c9A/waDx80WklECowHbSPnUMN/2ix+TIld+XSX2oqLLeq1XDwahpCjwSdfcmHE0og2IIxNMs3J/KYX4vK+JhkuW63migOeRJ7SOevkeBmqwQDY8Dw++c+d5b6203B7QBh7XHKf0a4L+gW+moRfsllaWX6w5iZI2Jtu1ozgN8yXkP4uVYnXqYANtSnc52Em+5GBnztYmJyGWBCdTln0TVGvt/ot8zMOqVE8xu15dTTMB1ICaw6mdk+eMnSG4ixcXo2l4LfmBOU8NP0g/BHWyG0bUhlGQnG1Mk1McdLMV3tCLV+aXpBXDh6nz/0/3MTJ+W5X7Z blackplum-production"

# Add to ubuntu user (most common)
echo "$SSH_KEY" >> /home/ubuntu/.ssh/authorized_keys
chmod 600 /home/ubuntu/.ssh/authorized_keys
chown ubuntu:ubuntu /home/ubuntu/.ssh/authorized_keys

# Also add to ec2-user (in case it's Amazon Linux)
if [ -d "/home/ec2-user" ]; then
    echo "$SSH_KEY" >> /home/ec2-user/.ssh/authorized_keys
    chmod 600 /home/ec2-user/.ssh/authorized_keys
    chown ec2-user:ec2-user /home/ec2-user/.ssh/authorized_keys
fi

# Also add to root (backup)
echo "$SSH_KEY" >> /root/.ssh/authorized_keys 