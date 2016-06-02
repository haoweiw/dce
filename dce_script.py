#! /usr/bin/env python

from git import *
import os
import webbrowser
import sys
import time

HOME = os.environ['HOME']
PATH = '%s%s' % (HOME,'/test_bed/dce/')
DHCP_WEB = ('http://localhost')				#TODO Get CL URL
REPO = Repo(PATH)
WORKING_BRANCH = '%s' % ('dce-update')
VAL_SCRIPT = '~/chromeos-admin/utils/presubmit_hooks/validate_dhcpd_conf.py'
VAL_CALL = 'sudo python %s' % (VAL_SCRIPT)

def main():
    git = REPO.git
    CreateBranch(git,WORKING_BRANCH)
    webbrowser.open(DHCP_WEB)
    time.sleep(2) 					#Helps output stay constant with processes being called

    raw_input("\nOnce changes are complete, Press 'Enter' to continue...")

    ValidateChanges()

#moves to master branch, removes pre-existing development branch if it exists
#creates a clean development branch
def CreateBranch(git,working):
    git.checkout('master')
    try:
        git.checkout('HEAD', b = WORKING_BRANCH)
    except:
        print("\nRemoving pre-existing 'dce-update' branch\n")
        git.branch('-D', WORKING_BRANCH)
        git.checkout('HEAD', b = WORKING_BRANCH)

def ValidateChanges():
    confirm = raw_input("\nAre your changes compelte? Y/N: ")
    upperConfirm = confirm.upper()
    if upperConfirm == "Y" or upperConfirm == "YES" :
        print confirm.upper()
        #call validate dhcp script
        #if pass continue, else raise exception and print error
            #commit to branch with generic message "Updating DHCPD file"
            #push to HEAD:refs/for/master, print output to terminal
            #OPTIONAL - open browser to CL page
        #else
            #Report error message
            #call main()
    elif upperConfirm == "N" or upperConfirm == "NO" :
        print confirm.upper()
        #remove

if __name__ == '__main__':
  main()
